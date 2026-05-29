package com.example.backend.service;

import com.example.backend.dto.UploadResponse;
import com.example.backend.entity.Document;
import com.example.backend.entity.NotificationType;
import com.example.backend.exception.FileStorageException;
import com.example.backend.exception.InvalidFileTypeException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.DocumentRepository;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FileService {

    private static final Path UPLOAD_DIR = Paths.get("uploads");
    private static final Path TEMP_DIR = UPLOAD_DIR.resolve("temp");
    private static final long MAX_FILE_SIZE = 20L * 1024L * 1024L; // 20MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf"
    );

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ApplicationContext applicationContext;

    @PostConstruct
    public void ensureDirectoriesExist() {
        try {
            Files.createDirectories(UPLOAD_DIR);
            Files.createDirectories(TEMP_DIR);
        } catch (IOException e) {
            throw new FileStorageException("Could not initialize storage directories.", e);
        }
    }

    public Document uploadFile(MultipartFile file) {
        validateFile(file);
        Path destination = resolveUploadPath(file.getOriginalFilename());

        try {
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new FileStorageException("Could not store file " + file.getOriginalFilename(), e);
        }

        Document document = createDocument(file, destination);
        return documentRepository.save(document);
    }

    public List<Document> uploadFiles(MultipartFile[] files) {
        return Arrays.stream(files)
                .map(this::uploadFile)
                .collect(Collectors.toList());
    }

    public void uploadFilesInBackground(MultipartFile[] files) {
        if (files.length == 0) {
            throw new InvalidFileTypeException("At least one file must be provided for bulk upload.");
        }

        List<BulkUploadTask> tasks = saveFilesToTemp(files);
        notificationService.createNotification(
                "Upload in progress — processing " + files.length + " files in background",
                NotificationType.INFO
        );
        applicationContext.getBean(FileService.class).processBulkUploadAsync(tasks);
    }

    private List<BulkUploadTask> saveFilesToTemp(MultipartFile[] files) {
        return Arrays.stream(files)
                .peek(this::validateFile)
                .map(this::copyToTempFile)
                .collect(Collectors.toList());
    }

    private BulkUploadTask copyToTempFile(MultipartFile file) {
        String originalName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String tempFileName = UUID.randomUUID() + "_" + originalName;
        Path tempPath = TEMP_DIR.resolve(tempFileName);

        try {
            Files.copy(file.getInputStream(), tempPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new FileStorageException("Could not save temporary file " + originalName, e);
        }

        return new BulkUploadTask(originalName, file.getContentType(), file.getSize(), tempPath);
    }

    @Async
    public void processBulkUploadAsync(List<BulkUploadTask> tasks) {
        try {
            List<Document> savedDocuments = new ArrayList<>();

            for (BulkUploadTask task : tasks) {
                Path destination = resolveUploadPath(task.fileName());
                Files.move(task.tempPath(), destination, StandardCopyOption.REPLACE_EXISTING);

                Document document = new Document();
                document.setFileName(task.fileName());
                document.setFileType(task.fileType());
                document.setFileSize(task.fileSize());
                document.setFilePath(destination.toString());
                document.setUploadedAt(LocalDateTime.now());
                savedDocuments.add(documentRepository.save(document));
            }

            notificationService.createNotification(
                    tasks.size() + " files uploaded successfully",
                    NotificationType.SUCCESS
            );
        } catch (Exception e) {
            notificationService.createNotification(
                    "Bulk upload failed. Please try again.",
                    NotificationType.ERROR
            );
            throw new FileStorageException("Failed to complete bulk upload.", e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileTypeException("File is empty or missing.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileStorageException("File exceeds maximum size of 20MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            String name = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            if (!name.toLowerCase().endsWith(".pdf")) {
                throw new InvalidFileTypeException("Only PDF files are supported.");
            }
        }
    }

    private Path resolveUploadPath(String originalFileName) {
        String sanitizedFileName = StringUtils.cleanPath(Objects.requireNonNull(originalFileName));
        Path destination = UPLOAD_DIR.resolve(sanitizedFileName);

        if (Files.exists(destination)) {
            String baseName = sanitizedFileName;
            String extension = "";
            int index = sanitizedFileName.lastIndexOf('.');
            if (index > 0) {
                baseName = sanitizedFileName.substring(0, index);
                extension = sanitizedFileName.substring(index);
            }
            destination = UPLOAD_DIR.resolve(baseName + "_" + UUID.randomUUID() + extension);
        }

        return destination;
    }

    private Document createDocument(MultipartFile file, Path destination) {
        Document document = new Document();
        document.setFileName(StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename())));
        document.setFileType(file.getContentType());
        document.setFileSize(file.getSize());
        document.setFilePath(destination.toString());
        document.setUploadedAt(LocalDateTime.now());
        return document;
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id " + id));
    }

    public void deleteDocument(Long id) {
        Document document = getDocumentById(id);

        try {
            Files.deleteIfExists(Paths.get(document.getFilePath()));
        } catch (IOException e) {
            throw new FileStorageException("Could not delete file " + document.getFileName(), e);
        }

        documentRepository.deleteById(id);
    }

    private record BulkUploadTask(
            String fileName,
            String fileType,
            long fileSize,
            Path tempPath) {
    }
}