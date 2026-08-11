# SYNOVAINFO CMS - COMPREHENSIVE TESTING CHECKLIST

**Site:** https://synovainfo.com/admin/pages  
**Credentials:** admin@synovainfo.com / password123  

---

## ✅ AUTHENTICATION & LOGIN

### Test 1.1: Login Functionality
- [ ] Navigate to `/admin`
- [ ] Enter email: `admin@synovainfo.com`
- [ ] Enter password: `password123`
- [ ] Click "Login" button
- [ ] Verify: Dashboard loads successfully
- [ ] Verify: Session cookie is set
- [ ] Verify: Redirect to admin panel works

---

## 📄 PAGES - CRUD OPERATIONS

### Test 2.1: READ - List All Pages
**Endpoint:** GET `/admin/api/pages`
- [ ] Request executes without errors
- [ ] Response includes all existing pages
- [ ] Response includes required fields: id, title, slug, status, published_at

### Test 2.2: CREATE - Add New Page
**Endpoint:** POST `/admin/api/pages`
- [ ] Request executes successfully
- [ ] New page is created with all fields
- [ ] Page receives unique ID
- [ ] Default status applied if not specified

### Test 2.3: UPDATE - Modify Existing Page
**Endpoint:** PUT `/admin/api/pages/{id}`
- [ ] Update request executes successfully
- [ ] Changes are reflected in database
- [ ] Partial updates work

### Test 2.4: DELETE - Remove Page
**Endpoint:** DELETE `/admin/api/pages/{id}`
- [ ] Delete request executes successfully
- [ ] Page is removed from database

---
*(Same structure applies to Blog Posts, Categories, Tags, Case Studies, Portfolios, and Team Members)*
