# Deployment Checklist

## Pre-Deployment (Development)

### Backend Setup
- [ ] Code review of `backend/server.py` changes
- [ ] Test upload endpoint locally
  ```bash
  curl -X POST http://localhost:8001/api/parent/vaccinations/{id}/upload-document \
    -H "Authorization: Bearer <token>" \
    -F "file=@test.jpg"
  ```
- [ ] Test get endpoint locally
  ```bash
  curl http://localhost:8001/api/vaccinations/{id}/documents \
    -H "Authorization: Bearer <token>"
  ```
- [ ] Test delete endpoint locally
  ```bash
  curl -X DELETE http://localhost:8001/api/vaccination-documents/{id} \
    -H "Authorization: Bearer <token>"
  ```

### Database Setup (Development)
- [ ] Create Supabase project (if needed)
- [ ] Open SQL Editor in Supabase Dashboard
- [ ] Paste SQL from `backend/supabase_schema.sql`
- [ ] Run SQL migration
- [ ] Verify table created:
  ```sql
  SELECT * FROM vaccination_documents LIMIT 1;
  ```
- [ ] Verify indexes created
  ```sql
  SELECT * FROM pg_indexes WHERE tablename = 'vaccination_documents';
  ```

### Storage Setup (Development)
- [ ] Go to Supabase Storage
- [ ] Click "New bucket"
- [ ] Name: `vaccination-documents`
- [ ] Toggle: Public (enable)
- [ ] Create bucket
- [ ] Test upload via dashboard

### Frontend Setup
- [ ] Check components exist:
  - [ ] `VaccineCardWithDocuments.jsx`
  - [ ] `VaccinationDocumentUpload.jsx`
  - [ ] `VaccinationDocumentViewer.jsx`
  - [ ] `useVaccinationDocuments.js`
- [ ] Verify imports work:
  ```bash
  cd frontend
  npm run build
  ```
- [ ] No TypeScript errors
- [ ] No bundle warnings

### Testing (Development)

#### Parent Upload Flow
- [ ] Login as parent
- [ ] Navigate to child profile
- [ ] See upload button on vaccine card
- [ ] Click camera button → take photo ✓
- [ ] Click gallery button → select photo ✓
- [ ] Preview shows in modal ✓
- [ ] Click "Upload Document" ✓
- [ ] Success toast appears ✓
- [ ] Thumbnail appears on card ✓
- [ ] Page reload → document persists ✓

#### Parent View Flow
- [ ] Click document thumbnail ✓
- [ ] Lightbox opens ✓
- [ ] Image displays ✓
- [ ] Download button works ✓
- [ ] Delete button works ✓
- [ ] Confirm dialog shows ✓
- [ ] Document deleted ✓
- [ ] Previous/Next navigation works ✓
- [ ] Document counter shows (1/2, etc.) ✓

#### Doctor View Flow
- [ ] Login as doctor
- [ ] Search child
- [ ] View child record
- [ ] See document icons on vaccines ✓
- [ ] Click icon → lightbox opens ✓
- [ ] Can view documents ✓
- [ ] No upload button ✓
- [ ] No delete button ✓
- [ ] Download works ✓

#### Error Cases
- [ ] Upload >5MB file → error message ✓
- [ ] Upload non-image → error message ✓
- [ ] Slow connection → loading state shows ✓
- [ ] Network error → retry option ✓
- [ ] Permission denied → clear error ✓

#### Performance
- [ ] Upload time acceptable (<5 seconds) ✓
- [ ] Thumbnail load fast (<500ms) ✓
- [ ] Lightbox responsive ✓
- [ ] No lag when scrolling ✓

#### Mobile Testing
- [ ] iOS camera access works ✓
- [ ] iOS gallery access works ✓
- [ ] Android camera access works ✓
- [ ] Android gallery access works ✓
- [ ] Touch navigation works ✓
- [ ] Orientation change handled ✓
- [ ] Long press to download works ✓

### Code Review
- [ ] All error messages clear
- [ ] No console errors or warnings
- [ ] No security issues
- [ ] No hardcoded values
- [ ] Environment variables used
- [ ] Comments added for complex logic
- [ ] No debugging code left in
- [ ] Proper error handling throughout

### Documentation Review
- [ ] All docs exist
- [ ] All docs are accurate
- [ ] API endpoints documented
- [ ] Component props documented
- [ ] Troubleshooting complete
- [ ] Examples included
- [ ] Links work
- [ ] No typos

---

## Staging Deployment

### Database
- [ ] Create staging database (if separate)
- [ ] Run SQL migration on staging
- [ ] Verify table and indexes
- [ ] Test with staging data

### Storage
- [ ] Create `vaccination-documents` bucket in staging
- [ ] Verify bucket is public
- [ ] Test upload to staging bucket
- [ ] Verify URL format correct

### Backend
- [ ] Deploy backend to staging
- [ ] Verify endpoints responding
- [ ] Test with real staging data
- [ ] Check logs for errors
- [ ] Monitor performance

### Frontend
- [ ] Deploy frontend to staging
- [ ] Test all flows end-to-end
- [ ] Cross-browser testing:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Mobile testing:
  - [ ] iOS Safari
  - [ ] Android Chrome
  - [ ] iPhone camera
  - [ ] Android camera

### Staging Test Suite
- [ ] Run full parent flow
- [ ] Run full doctor flow
- [ ] Run all error cases
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Mobile works

### Stakeholder Sign-Off
- [ ] Product owner approval
- [ ] QA team approval
- [ ] Backend team approval
- [ ] Frontend team approval

---

## Production Deployment

### Pre-Production Checklist

**Database:**
- [ ] Production database identified
- [ ] Backup created before migration
- [ ] SQL migration ready
- [ ] Rollback plan documented

**Storage:**
- [ ] Production Supabase account
- [ ] Bucket name confirmed
- [ ] Public access verified
- [ ] Pricing tier acceptable
- [ ] Monitoring enabled

**Backend:**
- [ ] Code merged to main
- [ ] Tests passing
- [ ] No breaking changes
- [ ] Environment variables set
- [ ] Monitoring configured

**Frontend:**
- [ ] Code merged to main
- [ ] Build succeeds
- [ ] No console errors
- [ ] CDN cache configured
- [ ] Rollback plan ready

### Deployment Process

**Step 1: Database Migration**
```bash
# In Supabase Production Dashboard
# SQL Editor → paste migration
# Execute SQL
# Verify: SELECT * FROM vaccination_documents;
```

**Step 2: Storage Bucket**
```
Supabase Storage → New Bucket
- Name: vaccination-documents
- Public: Yes
- Create
```

**Step 3: Backend Deployment**
```bash
# Deploy server.py with endpoints
# Verify health check: /health
# Smoke test: POST upload-document
```

**Step 4: Frontend Deployment**
```bash
# Build frontend
npm run build
# Deploy to CDN/server
# Clear CDN cache
# Verify: Check console for errors
```

**Step 5: Verification**
- [ ] Test parent upload flow
- [ ] Test doctor view flow
- [ ] Check logs for errors
- [ ] Monitor performance
- [ ] Verify analytics tracking

### Post-Deployment (First 24 Hours)

**Monitoring:**
- [ ] Check error logs hourly
- [ ] Monitor upload success rate
- [ ] Monitor API response times
- [ ] Check storage usage
- [ ] Monitor user feedback

**Alerts:**
- [ ] Set up error alerts
- [ ] Set up performance alerts
- [ ] Set up storage alerts
- [ ] Set up availability alerts

**Documentation:**
- [ ] Update any outdated docs
- [ ] Document any issues found
- [ ] Update deployment guide
- [ ] Create incident response plan

**Support:**
- [ ] Inform support team
- [ ] Provide troubleshooting guide
- [ ] Set up escalation path
- [ ] Monitor support tickets

### Post-Deployment (First Week)

**Stability:**
- [ ] Daily error log review
- [ ] Weekly performance report
- [ ] User feedback review
- [ ] Support ticket trends

**Optimization:**
- [ ] Analyze upload patterns
- [ ] Optimize file sizes
- [ ] Optimize DB queries
- [ ] Plan caching strategy

**Iteration:**
- [ ] Identify quick wins
- [ ] Plan improvements
- [ ] Document learnings
- [ ] Plan Phase 2 features

---

## Rollback Plan

### If Critical Issue Found

**Immediate Actions:**
1. Alert team in Slack
2. Create incident channel
3. Assess severity
4. Decide: Fix or rollback

**Rollback Database:**
```sql
-- Disable new features
UPDATE app_config SET vaccination_docs_enabled = false;

-- Keep table (data preservation)
-- Don't drop table unless critical
```

**Rollback Backend:**
- [ ] Revert to previous version
- [ ] Monitor for improvement
- [ ] Fix issue on dev branch
- [ ] Redeploy when ready

**Rollback Frontend:**
- [ ] Clear CDN cache
- [ ] Revert to previous build
- [ ] Hard refresh for users
- [ ] Monitor console errors

**Communication:**
- [ ] Notify stakeholders
- [ ] Update status page
- [ ] Inform users if applicable
- [ ] Document issue for retrospective

---

## Monitoring & Maintenance

### Daily Monitoring
- [ ] Check error logs
- [ ] Monitor API response times
- [ ] Check storage usage
- [ ] Review user feedback
- [ ] Check uptime status

### Weekly Tasks
- [ ] Performance report
- [ ] Storage usage analysis
- [ ] Cost review
- [ ] Security scan
- [ ] Database optimization

### Monthly Tasks
- [ ] Database maintenance
- [ ] Backup verification
- [ ] Security audit
- [ ] Performance optimization
- [ ] Capacity planning

### Metrics to Track
- Upload success rate (target: >99%)
- Average upload time (target: <5s)
- API response time (target: <100ms)
- Error rate (target: <0.1%)
- Storage growth rate
- User adoption rate

---

## Success Criteria

Production deployment is successful if:

**Functionality:**
- ✅ All features working
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Cross-browser compatible

**Performance:**
- ✅ Upload <5 seconds (2MB)
- ✅ API <100ms response
- ✅ Thumbnail load <500ms
- ✅ No lag or freezing

**Reliability:**
- ✅ 99%+ uptime
- ✅ <0.1% error rate
- ✅ Handles concurrent uploads
- ✅ Graceful error handling

**Security:**
- ✅ Parent-only upload
- ✅ File validation
- ✅ HTTPS enforced
- ✅ Access control working

**User Adoption:**
- ✅ No support tickets
- ✅ Positive feedback
- ✅ Good adoption rate
- ✅ Expected usage patterns

---

## Contacts & Escalation

**Frontend Lead:** [Name]  
**Backend Lead:** [Name]  
**DevOps/Infrastructure:** [Name]  
**Product Owner:** [Name]  
**QA Lead:** [Name]  

**Escalation Path:**
1. Team member encounters issue
2. Escalate to team lead
3. If critical: Escalate to tech lead
4. If urgent: Page on-call engineer

**Communication Channels:**
- Slack: #vaccination-documents-deploy
- Incident: #incidents
- Urgent: @on-call

---

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Backend Lead | | | ☐ |
| Frontend Lead | | | ☐ |
| QA Lead | | | ☐ |
| Product Owner | | | ☐ |
| Tech Lead | | | ☐ |

---

## Version History

| Version | Date | Status | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-07-28 | Ready | Initial deployment |
| | | | |

---

**Last Updated:** July 28, 2026  
**Status:** Ready for Deployment  
**Next Review:** Post-deployment (24 hours)
