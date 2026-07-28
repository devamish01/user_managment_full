# Auth Module

Location:

```text
src/modules/auth
```

## Abhi tak kya banaya?

### 1. routes/

**File:**

`routes/index.ts`

**Kaam:**

- Auth APIs define karna.
- Request ko sahi controller tak bhejna.
- Validation middleware call karna.

Flow:

```
Request
   │
   ▼
Route
```

---

### 2. controllers/

**File:**

`controllers/auth.controller.ts`

**Kaam:**

- Request receive karta hai.
- Service ko call karta hai.
- Success/Error response return karta hai.

Controller me business logic nahi likhenge.

Flow:

```
Route
   │
   ▼
Controller
```

---

### 3. services/

**File:**

`services/auth.service.ts`

**Kaam:**

Auth ka pura business logic.

Abhi:

- Email exist check
- Password hash
- User create

Ye file database se baat karti hai.

Flow:

```
Controller
    │
    ▼
Auth Service
```

---

### 4. validations/

**File:**

`validations/register.schema.ts`

**Kaam:**

Request body validate karna.

Check:

- Name
- Email
- Password

Galat data hoga to request controller tak nahi jayegi.

Flow:

```
Request
    │
    ▼
Validation
```

---

### 5. constants/

**File:**

`constants/messages.ts`

**Kaam:**

Auth module ke saare messages ek jagah rakhna.

Example:

- Register Success
- Login Success
- Email Already Exists

Hardcoded message dobara nahi likhenge.

---

## Auth Module Current Flow

```
POST /auth/register

        │
        ▼

Route

        │
        ▼

Validation

        │
        ▼

Controller

        │
        ▼

Auth Service

        │
        ▼

User Model

        │
        ▼

MongoDB
```

---

## Abhi Pending

- Controller ko Service se connect karna
- Register API complete karna
- Login API
- JWT Authentication
- Refresh Token
- Forgot Password
- Change Password