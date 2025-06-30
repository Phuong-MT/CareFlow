# CareFlow<p align="center">

<h2 align="center"> 
    Project lưu thời gian khi bạn chờ được phục vụ ở nhiều quầy
    <br> 
</h2>
    Được xây dụng bằng 2 project Client và Server. Client được viết bằng NextJs. Server được viết bằng NestJs

## Technology
    Runtime: NodeJs.
    Framework: NextJs & NestJs.
    Database: MySQL.
    Authentication: JWT & RBAC.

## Modules
    - User: Đăng ký, đăng nhập, xác thực JWT và phân quyền. Quản lý người dùng.
    - Just-it: Quản lý các mã JWT của người dùng khi logout.
    - Tenant: Quản lý từng Cty.
    - Location: Quản lý các địa điểm sự kiện.
    - Queue: Hàng đợi của người dùng.
    - Poc-assigment: Quản lý các POC(point of checkin).
    - FloorPlan: Quản lý map và các địa POC.
    - Event: Quản lý các sự kiện.
    - Analytics: Phân tích lượng người tham gia trong 1 phiên sự kiện, của cả sự kiện và của từng ngày.
    - Gate-ways: Socket real-time khi user join queue.

## Start
- NodeJs : >= v16.x, 18.x <br/>
- MySQL.

## Installing

<p>Tạo file .env theo cấu trúc của file .env.format.</p>
<ul>
<li>
<h1> 
  Client
</h1>
<pre>
  $ cd Client.
  $ npm i.
</pre>
<p>
  Nếu bạn muốn chạy thử:
   </p>
  
  <pre>
    npm run dev
  </pre>

</li>

<li>

<h1> 
  Server
</h1>

<pre>
  $ cd Server
  $ npm install
  $ npm start
</pre>
</li>
</ul>
