import { Deserializable } from "./deserializable.model";

export class Product implements Deserializable {
    constructor(
        public name: string,
        public price: number,
        public url?: string,
        public description?: string,
        public category_id?: number,
        // readonly seen?: number,
        public id?: number
    ) {
        if (this.isNumeric(category_id)) {
            this.category_id = parseInt(String(category_id));
        }
    }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

    /**
     * checks and validates the existence of a number
     * @param val string | null | undefined
     * @returns
     */
    private isNumeric(val: any) {
        return /^-?[0-9]+$/.test(String(val));
    }
}

export type apiProduct = {
    id: number;
    name: string;
    price: number;
    category_id?: number;
    seen?: number;
    url?: string;
    description?: string;
};
