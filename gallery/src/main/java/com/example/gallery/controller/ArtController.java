package com.example.gallery.controller;

import com.example.gallery.model.Art;
import com.example.gallery.service.ArtService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/art")
@AllArgsConstructor
public class ArtController {
    private ArtService artService;


    // GET all art
    @GetMapping
    public List<Art> getALlArt() {
        return artService.getAllArt();
    }

    // GET art based by id
    @GetMapping(path = "/{id}")
    public Optional<Art> getArtById(@PathVariable Integer id) {
        return artService.getArtById(id);
    }

    // POST your own art
    @PostMapping(path = "/create")
    public Art createArt(@RequestBody Art art) {
        return artService.createArt(art);
    }

    // DELETE your art by id
    @DeleteMapping(path = "delete/{id}")
    public ResponseEntity<Void> deleteArt(@PathVariable Integer id) {
        artService.deleteArt(id);
        return ResponseEntity.noContent().build();
    }

    // PUT new info for the art by id
    @PutMapping(path = "update/{id}")
    public ResponseEntity<Art> updateArt(@RequestBody Art art, @PathVariable Integer id) {
       return artService.getArtById(id)
               .map(existArt -> {
                   existArt.setTitle(art.getTitle());
                   existArt.setArtistName(art.getArtistName());
                   existArt.setDescription(art.getDescription());
                   existArt.setImgUrl(art.getImgUrl());

                   Art updateArt = artService.createArt(existArt);
                   return ResponseEntity.ok(updateArt);
               })
               .orElseGet(() -> ResponseEntity.notFound().build());

    }

}
