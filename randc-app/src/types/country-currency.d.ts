// src/types/country-currency.d.ts
declare module 'country-currency' {
    /**
     * Each country code maps to an object with these fields.
     * (Symbol can be optional if not provided by all entries.)
     */
    interface CountryCurrencyInfo {
      country: string;
      currency: string;
      symbol?: string;
    }
  
    /**
     * The default export is a Record: { "US": { country: "United States", currency:"USD", ...}, ...}
     */
    const data: Record<string, CountryCurrencyInfo>;
  
    export default data;
  }
  