export class Configuration {
  appSettings: AppSettings[];
}

export class AppSettings {
  add: Add[];
}

export class Add {
  $: keyValueObject;
}

export class keyValueObject {
  key: string;
  value: string;
}

export class JSONProperties {
  API_URL: string;
}
