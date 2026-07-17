export type EventPayload = Record<string, unknown>;
export interface DomainEvent<Ttype extends string, TPayload extends EventPayload> {
    type: Ttype;
    payload: TPayload;
    occurredAt: string;
}
export interface EventMetaData {
    correlationId?: string;
    causationId?: string;
    version?: number;
}
export interface OutboundEvent<TType extends string, TPayload extends EventPayload> extends DomainEvent<TType, TPayload> {
    metadata?: EventMetaData;
}
export interface InboundEvent<TType extends string, TPayload extends EventPayload> extends DomainEvent<TType, TPayload> {
    metadata: EventMetaData;
}
//# sourceMappingURL=event-types.d.ts.map