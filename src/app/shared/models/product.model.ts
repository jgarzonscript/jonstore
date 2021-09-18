import { Deserializable } from "./deserializable.model";

export class Product implements Deserializable {
    constructor(
        public id: number,
        public name: string,
        public price: number,
        public category_id: number,
        public seen: number,
        public url: string,
        public description: string
    ) {}

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
