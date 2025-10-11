---
layout: chapter
title: Example Chapter
chapter_number: 1
description: This is an example chapter to demonstrate the Telar framework.
first_object: example-object-01
previous_chapter: null
next_chapter: /chapters/02-next-chapter/
objects:
  - example-object-01
  - example-object-02
glossary_terms:
  - example-term
steps:
  - id: step-1
    object: example-object-01
    x: 0.5
    y: 0.5
    zoom: 1
    layer1:
      title: "Layer 1: More Context"
      text: "This is the first layer of additional information. It provides more detailed context about the topic introduced in the main narrative."
      media: null
    layer2:
      title: "Layer 2: Deep Dive"
      text: "This is the second layer with even more scholarly detail and analysis."
      media: null
  - id: step-2
    object: example-object-01
    x: 0.3
    y: 0.3
    zoom: 2
    layer1:
      title: "Closer Look"
      text: "Now we zoom in to examine specific details of the object."
      media: null
    layer2: null
---

<!-- Story Step 1 -->
<div class="story-step"
     data-step="1"
     data-object="example-object-01"
     data-x="0.5"
     data-y="0.5"
     data-zoom="1">
  <h2>What is this object?</h2>
  <p>This is the main narrative text for the first story step. It introduces the object and poses a question to engage the reader.</p>
  <p><button class="panel-trigger" data-panel="layer1" data-step="step-1">Read more →</button></p>
</div>

<!-- Story Step 2 -->
<div class="story-step"
     data-step="2"
     data-object="example-object-01"
     data-x="0.3"
     data-y="0.3"
     data-zoom="2">
  <h2>What do we see here?</h2>
  <p>As we scroll, the viewer zooms and pans to focus on a specific detail of the object.</p>
  <p><button class="panel-trigger" data-panel="layer1" data-step="step-2">Explore this detail →</button></p>
</div>

<!-- Story Step 3 -->
<div class="story-step"
     data-step="3"
     data-object="example-object-01"
     data-x="0.7"
     data-y="0.7"
     data-zoom="2.5">
  <h2>Another perspective</h2>
  <p>This step demonstrates how the narrative can guide the viewer's attention to different parts of the object.</p>
</div>

<!-- Final Step -->
<div class="story-step"
     data-step="4"
     data-object="example-object-01"
     data-x="0.5"
     data-y="0.5"
     data-zoom="1">
  <h2>Conclusion</h2>
  <p>The final step returns to a full view and summarizes the key insights from this chapter.</p>
  <p>Continue to the next chapter to learn more.</p>
</div>
