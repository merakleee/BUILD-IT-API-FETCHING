# Build-it Project — API Fetching 

An educational and visual app built to understand **API fetching concepts in React**.  
The goal of this project is simple:

> **We don’t just code — we visualize.**

---

## 🎯 Project Purpose

This project was created as part of the **Build-it workshop** to demonstrate how data fetching works in modern frontend applications, starting from the fundamentals.

Instead of only showing code, we **visualize the flow of data** between the browser, the API, and the UI.

---

## What was done today

### Fetching Fundamentals — `fetch()`

- Basic `fetch()` usage
- Async / await pattern
- Request → Response lifecycle
- UI state transitions (idle, loading, success)
- Visual data flow representation

---

- Browser → API → UI

```mermaid
flowchart LR
    Browser[Browser] -->|HTTP Request| API[API]
    API -->|HTTP Response| UI[UI]
