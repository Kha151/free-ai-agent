/**
 * devTools.mjs
 * Khakhapkhun AI - Tools for Mode 3: Learning Dev (Fullstack & Software Engineering)
 */

/**
 * 1. Phân tích Độ phức tạp Thuật toán & Cấu trúc Dữ liệu (Big-O Analyzer)
 */
export async function explainAlgorithmComplexity({
  algorithmName = "Binary Search",
  timeComplexity = "O(log N)",
  spaceComplexity = "O(1)"
}) {
  const algoGuide = {
    name: algorithmName,
    timeComplexity: {
      bestCase: timeComplexity.includes("log") ? "O(1)" : timeComplexity,
      averageCase: timeComplexity,
      worstCase: timeComplexity
    },
    spaceComplexity: spaceComplexity,
    explanation: `Thuật toán ${algorithmName} có độ phức tạp thời gian trung bình là ${timeComplexity} và không gian lưu trữ là ${spaceComplexity}.`,
    optimizationTips: [
      "Tránh lồng vòng lặp không cần thiết dẫn đến O(N^2) hoặc O(N^3).",
      "Sử dụng Hash Map / Hash Set (O(1) lookup) thay vì mảng tuần tự O(N) khi cần tìm kiếm phần tử thường xuyên.",
      "Cân nhắc Two Pointers hoặc Sliding Window trên mảng đã sắp xếp để giảm độ phức tạp từ O(N^2) xuống O(N).",
      "Đối với xử lý đệ quy, luôn kiểm tra điều kiện dừng (Base case) và áp dụng Memoization / Dynamic Programming để tránh lặp lại phép tính."
    ]
  };

  return JSON.stringify(algoGuide);
}

/**
 * 2. Tạo Cấu Trúc Dự Án Chuẩn Công Nghiệp (Project Structure Generator)
 */
export async function generateProjectStructure({
  projectType = "backend", // "backend", "frontend", "fullstack"
  framework = "express", // "express", "nestjs", "fastapi", "react", "nextjs", "spring-boot"
  architectureStyle = "clean-architecture" // "clean-architecture", "mvc", "modular"
}) {
  let structure = "";
  let description = "";

  if (architectureStyle === "clean-architecture") {
    structure = `
src/
├── domain/                  # Lớp lõi: Entity, Business Rules độc lập với framework
│   ├── entities/            # Các thực thể dữ liệu (User, Product, Order)
│   ├── repositories/        # Interfaces định nghĩa các hàm lưu trữ (IUserRepository)
│   └── errors/              # Domain-specific exceptions
├── application/             # Lớp ứng dụng: Chứa Use Cases và DTOs
│   ├── use-cases/           # CreateUserUseCase, AuthenticateUserUseCase
│   ├── dtos/                # Request & Response Data Transfer Objects
│   └── interfaces/          # Services interfaces (IEmailService, ITokenService)
├── infrastructure/          # Lớp hạ tầng: Giao tiếp DB, external API, cache
│   ├── database/            # Prisma/TypeORM/Mongoose models, migrations, repo implementations
│   ├── external-services/   # Gửi mail, cổng thanh toán (Stripe, VNPay)
│   └── security/            # JWT, Hash password (bcrypt)
└── presentation/            # Lớp giao diện / Controllers
    ├── controllers/         # Nhận HTTP request, gọi Use Case và trả response
    ├── middlewares/         # AuthMiddleware, ValidationMiddleware, ErrorHandler
    └── routes/              # Định nghĩa API routes (Express/Fastify router)
tests/
├── unit/                    # Test độc lập domain & use cases (mock repo)
└── integration/             # Test API thực tế kết nối DB
.env.example
docker-compose.yml
Dockerfile
package.json
tsconfig.json
`;
    description = "Clean Architecture (Onion/Hexagonal): Đảm bảo mã nguồn dễ bảo trì, dễ viết Unit Test và có thể thay thế Database hoặc Web Framework mà không ảnh hưởng đến nghiệp vụ lõi (Business Logic).";
  } else if (framework === "nextjs" || projectType === "frontend") {
    structure = `
src/
├── app/                     # App Router (Next.js 14+)
│   ├── (auth)/login/        # Route group không ảnh hưởng URL
│   ├── dashboard/           # Trang Dashboard
│   ├── api/                 # Route Handlers (Backend API tích hợp)
│   ├── layout.tsx           # Layout dùng chung toàn app
│   └── page.tsx             # Trang chủ
├── components/              # UI Components tái sử dụng
│   ├── ui/                  # Atoms: Button, Input, Modal, Badge (Shadcn/Tailwind)
│   └── shared/              # Molecules & Organisms: Navbar, Sidebar, Footer
├── hooks/                   # Custom React Hooks (useDebounce, useAuth)
├── lib/                     # Configs & utilities (axios instance, formatters)
├── services/                # API client calls (fetchers / react-query queries)
├── store/                   # Global state (Zustand / Redux Toolkit)
├── types/                   # TypeScript interfaces & types
└── styles/                  # Global CSS, Tailwind config
`;
    description = "Cấu trúc Frontend hiện đại (Next.js App Router + TypeScript + TailwindCSS), phân tách rõ ràng giữa UI components, business hooks và API services.";
  } else {
    structure = `
src/
├── controllers/             # Tiếp nhận request và điều hướng
├── models/                  # Định nghĩa schema cơ sở dữ liệu
├── routes/                  # Định tuyến endpoint
├── services/                # Xử lý nghiệp vụ logic
├── middlewares/             # Xác thực, logging, kiểm tra dữ liệu đầu vào
├── utils/                   # Hàm tiện ích dùng chung
└── config/                  # Cấu hình biến môi trường, kết nối database
`;
    description = "Kiến trúc MVC / Layered chuẩn cho các dự án REST API vừa và nhỏ.";
  }

  return JSON.stringify({
    status: "SUCCESS",
    projectType,
    framework,
    architectureStyle,
    description,
    directoryTree: structure.trim()
  });
}
