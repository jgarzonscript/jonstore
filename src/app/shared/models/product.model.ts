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
    ) {}

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
