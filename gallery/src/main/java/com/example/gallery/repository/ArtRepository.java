package com.example.gallery.repository;

import com.example.gallery.model.Art;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtRepository extends JpaRepository<Art, Integer> {
}
