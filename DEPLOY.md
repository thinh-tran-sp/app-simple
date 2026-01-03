# Hướng dẫn Deploy lên GPT App Store

## Bước 1: Deploy Backend lên Vercel

### 1.1. Cài đặt Vercel CLI
```powershell
npm install -g vercel
```

### 1.2. Login vào Vercel
```powershell
vercel login
```

### 1.3. Deploy
```powershell
# Deploy lần đầu (sẽ hỏi một số câu hỏi, chọn mặc định)
vercel

# Deploy production
vercel --prod
```

Sau khi deploy thành công, bạn sẽ nhận được URL như: `https://hello-world-gpt-app-xxxxx.vercel.app`

### 1.4. Cập nhật OpenAPI Schema
1. Mở file `openapi.yaml`
2. Thay `https://YOUR_APP_URL.vercel.app` bằng URL thực tế từ Vercel
3. Lưu file

## Bước 2: Host OpenAPI Schema

### Option 1: GitHub Gist (Khuyến nghị)

1. Vào https://gist.github.com
2. Tạo file mới tên `openapi.yaml`
3. Copy toàn bộ nội dung từ file `openapi.yaml` (đã cập nhật URL)
4. Click "Create public gist"
5. Copy URL raw: Click vào file → Raw → Copy URL

URL sẽ có dạng: `https://gist.githubusercontent.com/username/gist-id/raw/openapi.yaml`

### Option 2: Upload lên Vercel

1. Tạo thư mục `public` trong project
2. Copy file `openapi.yaml` vào `public/openapi.yaml`
3. Deploy lại: `vercel --prod`
4. URL sẽ là: `https://your-app.vercel.app/openapi.yaml`

## Bước 3: Tạo Custom GPT

1. Vào https://chatgpt.com/gpts/editor
2. Tab "Create":
   - **Name**: `Hello World App`
   - **Description**: `A simple Hello World app that greets users`
   - **Instructions**:
   ```
   You are a friendly Hello World assistant. When users ask you to say hello or greet them, use the sayHello action to greet them. Be warm and welcoming. If the user provides their name, use it in the greeting.
   ```

3. Tab "Configure":
   - Scroll xuống phần **"Actions"**
   - Click **"Create new action"**
   - Click **"Import from URL"**
   - Paste URL của OpenAPI schema (từ GitHub Gist)
   - Click **"Import"**

4. Test:
   - Click **"Test"** ở góc trên bên phải
   - Thử: "Say hello to me" hoặc "Hello, my name is John"

## Bước 4: Save và Publish

1. Click **"Save"** ở góc trên bên phải
2. Chọn một trong các options:
   - **"Only me"** (private - chỉ bạn dùng)
   - **"Anyone with a link"** (unlisted - ai có link đều dùng được)
   - **"Public"** (công khai trên GPT Store - cần review)

## Checklist

- [ ] Đã deploy backend lên Vercel
- [ ] Đã cập nhật URL trong openapi.yaml
- [ ] Đã host openapi.yaml trên GitHub Gist
- [ ] Đã tạo Custom GPT và add Action
- [ ] Đã test trong GPT preview
- [ ] Đã save và publish

## Troubleshooting

### Server không chạy
- Kiểm tra port 3000 có đang được sử dụng không
- Chạy `npm install` lại

### Vercel deploy lỗi
- Kiểm tra file `vercel.json` có đúng format không
- Đảm bảo `server.js` là entry point

### GPT không gọi được API
- Kiểm tra OpenAPI schema URL có accessible không
- Kiểm tra CORS đã được enable (đã có trong code)
- Kiểm tra API URL trong OpenAPI schema có đúng không

