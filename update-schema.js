const fs = require('fs');
const path = require('path');
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const modelsToUpdate = ['Service', 'Industry', 'Technology', 'Client', 'Career', 'Resource', 'Testimonial', 'FAQ'];

modelsToUpdate.forEach(model => {
  const modelRegex = new RegExp('(model ' + model + ' \\{[^}]+)createdAt\\s+DateTime\\s+@default\\(now\\(\\)\\)', 'g');
  schema = schema.replace(modelRegex, '$1createdById   String?\n  createdBy     User?    @relation("' + model + 'CreatedBy", fields: [createdById], references: [id])\n  updatedById   String?\n  updatedBy     User?    @relation("' + model + 'UpdatedBy", fields: [updatedById], references: [id])\n  createdAt     DateTime @default(now())');
});

const userRegex = /(model User \{[\s\S]+?)(@@index)/;
let userRelations = '';
modelsToUpdate.forEach(model => {
  userRelations += '  created' + model + 's ' + model + '[] @relation("' + model + 'CreatedBy")\n';
  userRelations += '  updated' + model + 's ' + model + '[] @relation("' + model + 'UpdatedBy")\n';
});

schema = schema.replace(userRegex, '$1' + userRelations + '\n  $2');

fs.writeFileSync(schemaPath, schema);
