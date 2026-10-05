# Medicine Search Application

A simple and clean medicine search application built using React and the openFDA Drug Label API.

## How to run

1.  Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
2.  Navigate to the `medibuddy` directory:
    ```bash
    cd medibuddy
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Open your browser and navigate to `http://localhost:5173`.

## Trade-offs and Decisions

### 1. State Management and Caching
- **Decision:** Used a simple module-level `Map` object to cache search results.
- **Trade-off:** A full-fledged state management solution like Redux or React Query would provide more robust caching, query deduplication, and lifecycle management. However, given the assignment's simplicity and the prompt's warning against unnecessary optimization, a simple `Map` effectively prevents duplicate API calls for the same query without adding heavy third-party dependencies or boilerplate. The cache resets on page reload, which is acceptable for this use case to ensure data freshness.

### 2. Rendering Optimization
- **Decision:** Decided *against* aggressive use of `React.memo` or `useMemo` for rendering `MedicineCard` components.
- **Trade-off:** While `React.memo` can prevent unnecessary re-renders when parent state changes, here the `results` array is completely replaced with new references upon a successful API call. When the user types and results update, we want to re-render the list anyway. Thus, `useMemo` or `React.memo` would have added overhead for shallow comparisons without providing any actual performance benefit.

### 3. Request Cancellation
- **Decision:** Implemented `AbortController` in the `SearchPage`.
- **Reasoning:** Since users might type fast, we need to ensure that an older, slower API response does not overwrite a newer one. If a new request is fired, the previous ongoing request is actively aborted using `AbortController`.

### 4. Routing and Detail Page
- **Decision:** Used `react-router-dom` to manage navigation. When navigating to the Detail page from a search result, the existing medicine data is passed along in the router's state (`location.state`).
- **Trade-off:** This avoids an extra API call when navigating directly from the search results. If the user refreshes the Detail page (or shares the URL), the state is lost. To handle this fallback gracefully, the application detects the missing state and fetches the medicine details directly via the FDA API using the unique `id`.

### 5. Debouncing
- **Decision:** Built a custom `useDebounce` hook with a 500ms delay.
- **Reasoning:** Prevents spamming the FDA API on every keystroke, reducing server load and ensuring a smoother user experience.

### 6. Vanilla Vite to React conversion
- **Decision:** The assignment provided a boilerplate containing Vanilla JavaScript Vite files (`main.js`). Since the instructions specifically asked to evaluate React optimizations (e.g. `useMemo`), I converted the project into a proper React environment by installing `react`, `react-dom`, `@vitejs/plugin-react` and renaming entry points to `.jsx`.

## Tech Stack
- React
- React Router DOM
- Vite
- CSS (Vanilla)
- openFDA API
