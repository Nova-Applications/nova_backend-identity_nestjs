# nova_backend-identity_nestjs

## basic project structure

src/
├── common/
│   ├── decorators/
│   ├── exceptions/
│   ├── filters/
│   ├── interceptors/
│   └── pipes/
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   └── environment.config.ts
├── modules/
│   ├── user/
│   │   ├── commands/
│   │   │   ├── handlers/
│   │   │   │   └── create-user.handler.ts
│   │   │   └── impl/
│   │   │       └── create-user.command.ts
│   │   ├── queries/
│   │   │   ├── handlers/
│   │   │   │   └── get-user.handler.ts
│   │   │   └── impl/
│   │   │       └── get-user.query.ts
│   │   ├── events/
│   │   │   ├── handlers/
│   │   │   │   └── user-created.handler.ts
│   │   │   └── impl/
│   │   │       └── user-created.event.ts
│   │   ├── controllers/
│   │   │   └── user.controller.ts
│   │   ├── services/
│   │   │   └── user.service.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── dtos/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── user.module.ts
│   └── (other modules)
├── shared/
│   ├── cqrs/
│   │   ├── command-bus.ts
│   │   └── event-bus.ts
│   ├── database/
│   │   └── database.module.ts
│   ├── utilities/
│   │   └── helpers.ts
│   └── constants.ts
├── main.ts
└── app.module.ts


