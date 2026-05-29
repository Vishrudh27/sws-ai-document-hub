package com.example.backend.controller;

import com.example.backend.dto.UploadResponse;
import com.example.backend.entity.Document;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.service.FileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin("*")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private DocumentRepository documentRepository;

    @PostMapping("/upload")
    public ResponseEntity<Document> uploadFile(
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(fileService.uploadFile(file));
    }

    @PostMapping("/upload/bulk")
    public ResponseEntity<UploadResponse> uploadFiles(
            @RequestParam("files") MultipartFile[] files) {

        if (files.length == 0) {
            return ResponseEntity.badRequest()
                    .body(new UploadResponse("ERROR", "No files were provided.", 0));
        }

        if (files.length <= 3) {
            List<Document> documents = fileService.uploadFiles(files);
            return ResponseEntity.ok(
                    new UploadResponse(
                            "SUCCESS",
                            files.length + " file(s) uploaded successfully.",
                            files.length)
            );
        }

        fileService.uploadFilesInBackground(files);

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(new UploadResponse(
                        "BACKGROUND",
                        "Upload in progress — processing " + files.length + " files in background",
                        files.length)
                );
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllFiles() {
        return ResponseEntity.ok(documentRepository.findAll());
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Long id) throws Exception {

        Document document = fileService.getDocumentById(id);
        Path path = Paths.get(document.getFilePath());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + document.getFileName() + "\""
                )
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFile(
            @PathVariable Long id) {

        fileService.deleteDocument(id);
        return ResponseEntity.ok("Document deleted successfully");
    }
}