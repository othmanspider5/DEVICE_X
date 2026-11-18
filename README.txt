DEVICE X — TECH EXPLORER
========================

WHAT'S INCLUDED
- Responsive web app for desktop, tablet and mobile browsers
- Search by device, brand, category and specification keywords
- Device detail pages with technical specifications and source links
- Compare up to 3 devices
- Favorites saved in the browser
- Editable starter database in devices.json

HOW TO RUN ON WINDOWS
1. Extract DEVICE_X.zip.
2. Open the extracted folder.
3. Easiest: open a terminal in this folder and run:
      py -m http.server 8000
   (If 'py' does not work, try: python -m http.server 8000)
4. Open http://localhost:8000 in Chrome or Edge.

You can also use VS Code with the Live Server extension.

IMPORTANT DATA NOTE
This is a working first version with a small verified starter dataset, not yet an exhaustive worldwide device catalogue.
Many devices have multiple configurations and regional variants. The app displays uncertainty where manufacturer pages do not publish a value (for example, Apple does not list RAM on the iPhone 17 Pro technical-spec page).
Always check the linked manufacturer source and exact model/SKU before making a purchase or upgrade decision.

TO ADD DEVICES
Open devices.json and add another object following the existing entries. Keep fields accurate and add a manufacturer source URL and verification note.
For production-scale coverage, connect a maintained product-specification database/API and add an admin/import workflow. Do not treat scraped or user-submitted specs as verified without review.

CREATED BY OTHMAN LAMMALLAH
