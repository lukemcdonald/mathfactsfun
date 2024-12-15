// Borrowed from https://github.com/jenseng/abuse-the-platform/blob/2993a7e846c95ace693ce61626fa072174c8d9c7/app/utils/singleton.ts
// Modified by https://github.com/kentcdodds/kentcdodds.com/blob/main/app/utils/singleton.server.ts

declare global {
  // eslint-disable-next-line no-var
  var __singletons: Record<string, unknown>
}

export function singleton<Value>(name: string, value: () => Value): Value {
  global.__singletons ??= {}
  global.__singletons[name] ??= value()
  return global.__singletons[name] as Value
}
