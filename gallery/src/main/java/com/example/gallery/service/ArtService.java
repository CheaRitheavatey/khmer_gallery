package com.example.gallery.service;

import com.example.gallery.model.Art;
import com.example.gallery.repository.ArtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArtService {
    private final ArtRepository artRepository;

    @Autowired
    public ArtService (ArtRepository artRepository) {this.artRepository = artRepository; }

    public List<Art> getAllArt() {
        return artRepository.findAll();
    }

    public Optional<Art> getArtById(Integer id) {
        return artRepository.findById(id);
    }

    public Art createArt(Art art) {
        return artRepository.save(art);
    }


    public void deleteArt(Integer id) {
        artRepository.deleteById(id);
    }
}
