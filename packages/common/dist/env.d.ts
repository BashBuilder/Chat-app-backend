import type { ZodObject, ZodRawShape } from "zod";
interface EnvOptions {
    source?: NodeJS.ProcessEnv;
    serviceName?: string;
}
type SchemaOutput<TSchema extends ZodRawShape> = ZodObject<TSchema>["_output"];
export declare const createEnv: <TShape extends ZodRawShape>(schema: ZodObject<TShape>, options?: EnvOptions) => SchemaOutput<TShape>;
export type EnvSchema<TShape extends ZodRawShape> = ZodObject<TShape>;
export {};
//# sourceMappingURL=env.d.ts.map