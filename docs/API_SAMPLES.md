# Sample API Requests

Base URL: `http://localhost:5000/api` (or your backend URL).

---

## Health check

```bash
curl http://localhost:5000/api/health
```

---

## Auth

### Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}' \
  -c cookies.txt
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}' \
  -c cookies.txt
```

Response includes `token`; you can use it as Bearer token for protected routes.

### Google OAuth

```bash
# After getting id_token from Google Sign-In on the frontend:
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"credential":"<GOOGLE_ID_TOKEN>"}' \
  -c cookies.txt
```

### Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout -b cookies.txt
```

---

## Protected routes (use token or cookie)

Replace `YOUR_JWT_TOKEN` with the `token` from login/signup response.

### Get profile

```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Or with cookie (after login with `-c cookies.txt`):

```bash
curl http://localhost:5000/api/users/profile -b cookies.txt
```

### Create code review

```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "code": "function add(a, b) { return a + b; }",
    "language": "JavaScript"
  }'
```

### Get my reviews

```bash
curl http://localhost:5000/api/reviews \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Example JSON bodies

**Signup**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Login**

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Create review**

```json
{
  "code": "function add(a, b) {\n  return a + b;\n}",
  "language": "JavaScript"
}
```
