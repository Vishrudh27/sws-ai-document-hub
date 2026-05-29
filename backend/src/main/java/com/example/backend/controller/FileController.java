package com.example.backend.controller;

import com.example.backend.entity.Document;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.service.FileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
            @RequestParam("file") MultipartFile file)
            throws Exception {

        return ResponseEntity.ok(
                fileService.uploadFile(file)
        );
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllFiles() {

        return ResponseEntity.ok(
                documentRepository.findAll()
        );
    }
}