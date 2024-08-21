import { Command } from "commander";
import fs from "fs";
import path from "path";

// Función para convertir un string a camelCase
function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+|\-|\_|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+|\-|\_/g, "");
}

const program = new Command();

function createServiceFile(serviceName) {
  const camelCaseName = toCamelCase(serviceName);
  const reducerPath = `${camelCaseName}Api`;

  const content = `import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

/**
 * IMPORTANTE:
 * Debido a una limitación actual, no se pueden exportar los hooks individualmente sin causar problemas de tipos.
 * El siguiente código es un intento de exportar el hook use${serviceName}Mutation, pero resulta en el siguiente error de TypeScript:
 * "El tipo inferido de 'use${serviceName}Mutation' no se puede nombrar sin una referencia a '../../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks'. Es probable que esto no sea portátil. Es necesaria una anotación de tipo.ts(2742)"
 * en su lugar llamar directamente a ${camelCaseName}Service y acceder al hook
 * @example
   ${camelCaseName}Service.findAll(...params)
 */
export const ${camelCaseName}Service = createApi({
  reducerPath: "${reducerPath}",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    // Define aquí tus endpoints
  }),
});
`;

  const filePath = path.join("src", "stores", "services", `${camelCaseName}Service.ts`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Archivo ${camelCaseName}Service.ts creado en src/stores/services/`);

  // Actualizar el archivo de configuración del store
  updateStoreConfig(camelCaseName);
}


function updateStoreConfig(camelCaseName) {
  const storeConfigPath = path.join("src", "stores", "store.ts");
  let content = fs.readFileSync(storeConfigPath, "utf8");
  const importStatement = `import { ${camelCaseName}Service } from "./services/${camelCaseName}Service";\n`;
  
 // Insertar el import al principio del archivo
 const existingImportsRegex = /^import\s+.*\n*/m;
 if (!existingImportsRegex.test(content)) {
   content = `${importStatement}\n${content}`;
 } else {
   content = content.replace(existingImportsRegex, (match) => `${importStatement}\n${match}`);
 }
  // Añadir el nuevo servicio al rootReducer
  const reducerPathEntry = `[${camelCaseName}Service.reducerPath]: ${camelCaseName}Service.reducer,`;

  const rootReducerRegex = /const rootReducer = combineReducers\({([\s\S]*?)\}\);/;
  if (rootReducerRegex.test(content)) {
    content = content.replace(rootReducerRegex, (match, p1) => {
      // p1 es el contenido dentro de combineReducers({ ... })
      const updatedReducers = p1.trim().replace(/,\s*$/, ""); // Elimina la última coma si existe
      return `const rootReducer = combineReducers({${updatedReducers},\n  ${reducerPathEntry}\n});`;
    });
  } else {
    content = content.replace(
      /const rootReducer = combineReducers\({/,
      `const rootReducer = combineReducers({\n  ${reducerPathEntry},`
    );
  }

  fs.writeFileSync(storeConfigPath, content, "utf8");
  console.log(`Archivo de configuración del store actualizado con ${camelCaseName}Service`);
}

// Definición del comando CLI

program
  .command("create")
  .description("Crear un nuevo archivo de servicio")
  .command("store")
  .description("Crea un nuevo archivo de servicio")
  .requiredOption("--service <serviceName>", "Nombre del servicio")
  .action((options) => {
    console.log("Options:", options);
    const serviceName = options.service;
    if (!serviceName) {
      console.error("Por favor, proporciona un nombre para el servicio.");
      process.exit(1);
    }
    createServiceFile(serviceName);
  });

program.parse(process.argv);