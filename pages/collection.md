---
layout: default
title: Collection
permalink: /collection/
---

<div class="container my-5">
  <div class="row">
    <div class="col-12">
      <h1>Collection</h1>
      <p class="lead">Browse {{ site.objects.size }} objects from the collection.</p>
    </div>
  </div>

  {% if site.objects.size > 0 %}
  <div class="collection-grid">
    {% for object in site.objects %}
    <a href="{{ object.url | relative_url }}" class="collection-item">
      <div class="collection-item-image">
        {% if object.thumbnail %}
        <img src="{{ object.thumbnail | relative_url }}" alt="{{ object.title }}">
        {% elsif object.iiif_manifest %}
        <img src="{{ object.iiif_manifest | replace: 'info.json', 'full/400,/0/default.jpg' }}" alt="{{ object.title }}">
        {% else %}
        <div class="placeholder-image bg-secondary d-flex align-items-center justify-content-center" style="height: 250px;">
          <span class="text-white">No image</span>
        </div>
        {% endif %}
      </div>
      <h3>{{ object.title }}</h3>
      {% if object.date %}
      <p class="text-muted mb-0">{{ object.date }}</p>
      {% endif %}
      {% if object.creator %}
      <p class="text-muted mb-0">{{ object.creator }}</p>
      {% endif %}
    </a>
    {% endfor %}
  </div>
  {% else %}
  <div class="row">
    <div class="col-12">
      <div class="alert alert-info">
        <p class="mb-0">No objects in the collection yet. Add object files to the <code>_objects/</code> directory to populate the collection.</p>
      </div>
    </div>
  </div>
  {% endif %}
</div>
