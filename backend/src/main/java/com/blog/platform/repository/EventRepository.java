package com.blog.platform.repository;

import com.blog.platform.model.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCategoryNameIgnoreCase(String categoryName);
    List<Event> findByCategoryNameIgnoreCaseAndSubCategoryNameIgnoreCase(String categoryName, String subCategoryName);
    List<Event> findByStatusIgnoreCase(String status);
}
