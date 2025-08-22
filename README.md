# RestoReserve — React + Bootstrap (Customer & Admin)

Customer:
- Book: enter details → check availability → pick table → book
- My Bookings: search by phone → edit (re-check availability) or cancel

Admin:
- Reservations: filter by date/status/phone → edit (re-check) or cancel
- Tables: create and toggle availability

## Run
```bash
npm i
echo "VITE_API_BASE_URL=http://127.0.0.1:8000/api" > .env.local   # adjust if needed
npm run dev
```
Open http://localhost:5173

### API expectations
- POST /reservations/ accepts:
```json
{
  "reservation_start": "ISO",
  "reservation_end": "ISO",
  "table_id": 1,
  "status": "CONFIRMED",
  "no_of_people": 4,
  "customer_data": {
    "customer_name": "Alice",
    "customer_phone": "+614...",
    "customer_email": "a@example.com"
  }
}
```
- GET /reservations?customer_phone=+614... returns that customer's bookings.
- PATCH /reservations/{id}/ supports updating times/people/table_id or cancelling.
- GET /availability/?start=ISO&end=ISO&people=4 returns free tables.
