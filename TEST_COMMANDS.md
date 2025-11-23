# HerCycle API - Test Scenarios

**Use these curl commands to test all endpoints**

---

## ✅ **1. Health Check**

```bash
curl http://localhost:8000/health
```

---

## 👤 **2. Profile Management**

### Create Profile
```bash
curl -X POST http://localhost:8000/profile/ \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "height_cm": 165,
    "weight_kg": 55,
    "diet_type": "vegetarian",
    "food_constraints": ["no_dairy"],
    "budget_level": "medium",
    "food_access": "mess",
    "region": "south_india",
    "movement_space": "room",
    "activity_background": "beginner",
    "time_availability": "5-10min",
    "emotional_comfort_level": "medium",
    "preferred_product": "pads"
  }'
```

### Get Profile
```bash
curl http://localhost:8000/profile/
```

### Update Location
```bash
curl -X POST http://localhost:8000/profile/location \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 12.9716,
    "longitude": 77.5946,
    "allow_location": true
  }'
```

---

## 📅 **3. Cycle Tracking**

### Log First Cycle
```bash
curl -X POST http://localhost:8000/cycles/log \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2025-10-15",
    "period_length": 5,
    "flow_intensity": "medium",
    "symptoms": ["cramps", "headache"],
    "cycle_length": 28
  }'
```

### Log Second Cycle
```bash
curl -X POST http://localhost:8000/cycles/log \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2025-11-12",
    "period_length": 5,
    "flow_intensity": "heavy",
    "symptoms": ["cramps", "fatigue", "mood_swings"],
    "cycle_length": 28
  }'
```

### Get Cycle History
```bash
curl http://localhost:8000/cycles/history
```

### Get Cycle Patterns
```bash
curl http://localhost:8000/cycles/patterns
```

---

## 📝 **4. Daily Check-in**

### Submit Check-in
```bash
curl -X POST http://localhost:8000/checkin/ \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-11-23",
    "pain": 3,
    "energy": 7,
    "mood": "good",
    "stress": 2,
    "sleep_hours": 8,
    "symptoms": ["mild_cramps"],
    "notes": "Feeling pretty good today"
  }'
```

### Get Check-in History (Last 7 Days)
```bash
curl "http://localhost:8000/checkin/history?days=7"
```

---

## 🤖 **5. AI Plan Generation** ⭐

### Generate Today's Plan (This is the big one!)
```bash
curl -X POST http://localhost:8000/plan/today \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Note:** This takes 30-60 seconds. Be patient!

---

## 🆘 **6. Support & Resources**

### Get All Resources
```bash
curl http://localhost:8000/support/resources
```

### Get Resources by Topic
```bash
curl "http://localhost:8000/support/resources?topic=pain"
```

### Find Nearby Pharmacies
```bash
curl -X POST http://localhost:8000/support/nearby \
  -H "Content-Type: application/json" \
  -d '{
    "type": "products",
    "radius": 5000
  }'
```

### Find Nearby Clinics
```bash
curl -X POST http://localhost:8000/support/nearby \
  -H "Content-Type: application/json" \
  -d '{
    "type": "clinics",
    "radius": 10000
  }'
```

---

## 🧪 **Complete Test Flow**

Run these commands in order to test the full user journey:

```bash
# 1. Health check
curl http://localhost:8000/health

# 2. Create profile
curl -X POST http://localhost:8000/profile/ \
  -H "Content-Type: application/json" \
  -d '{"age": 25, "diet_type": "vegetarian", "movement_space": "room"}'

# 3. Log first cycle
curl -X POST http://localhost:8000/cycles/log \
  -H "Content-Type: application/json" \
  -d '{"start_date": "2025-10-15", "period_length": 5, "flow_intensity": "medium", "symptoms": ["cramps"]}'

# 4. Log second cycle
curl -X POST http://localhost:8000/cycles/log \
  -H "Content-Type: application/json" \
  -d '{"start_date": "2025-11-12", "period_length": 5, "flow_intensity": "medium", "symptoms": ["cramps"]}'

# 5. Daily check-in
curl -X POST http://localhost:8000/checkin/ \
  -H "Content-Type: application/json" \
  -d '{"pain": 3, "energy": 7, "mood": "good", "stress": 2, "sleep_hours": 8}'

# 6. Generate AI plan (WAIT 30-60 seconds)
curl -X POST http://localhost:8000/plan/today -H "Content-Type: application/json" -d '{}'

# 7. Get cycle patterns
curl http://localhost:8000/cycles/patterns
```

---

## 📊 **Pretty Print JSON Responses**

Add `| python3 -m json.tool` to any curl command:

```bash
curl http://localhost:8000/health | python3 -m json.tool
```

---

## 🎯 **Test Different Scenarios**

### High Pain Day
```bash
curl -X POST http://localhost:8000/checkin/ \
  -H "Content-Type: application/json" \
  -d '{
    "pain": 8,
    "energy": 3,
    "mood": "low",
    "stress": 7,
    "sleep_hours": 5,
    "symptoms": ["severe_cramps", "headache", "fatigue"]
  }'

# Then generate plan to see adjusted recommendations
curl -X POST http://localhost:8000/plan/today -H "Content-Type: application/json" -d '{}'
```

### Low Energy Day
```bash
curl -X POST http://localhost:8000/checkin/ \
  -H "Content-Type: application/json" \
  -d '{
    "pain": 2,
    "energy": 4,
    "mood": "okay",
    "stress": 5,
    "sleep_hours": 6,
    "symptoms": ["fatigue", "bloating"]
  }'
```

### Good Day
```bash
curl -X POST http://localhost:8000/checkin/ \
  -H "Content-Type: application/json" \
  -d '{
    "pain": 0,
    "energy": 9,
    "mood": "great",
    "stress": 1,
    "sleep_hours": 8,
    "symptoms": []
  }'
```

---

## 🔍 **Debug Server**

View server logs:
```bash
tail -f /home/ramkumar/Desktop/HerCycle/server.log
```

Check if server is running:
```bash
ps aux | grep uvicorn
```

Restart server:
```bash
cd /home/ramkumar/Desktop/HerCycle
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

**Happy Testing! 🚀**
