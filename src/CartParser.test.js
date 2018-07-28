import CartParser from './CartParser';
import { readFileSync } from 'fs';

let parser;

beforeEach(() => {
    parser = new CartParser();
});

describe("CartParser - unit tests", () => {
    it("should validate correct columns headers", () => {
        let content = "Product name,Price,Quantity";
        parser.createError = jest.fn();

        parser.validate(content);

        expect(parser.createError).toHaveBeenCalledTimes(0);

    });

    it("should validate errors with incorrect columns headers", () => {
        let content = "Name,Amount,Total";
        parser.createError = jest.fn();

        parser.validate(content);

        expect(parser.createError).toHaveBeenCalledTimes(3);

    });

    it("should validate error with incorrect second column header", () => {
        let content = "Product name,Value,Quantity";
        parser.createError = jest.fn();

        parser.validate(content);

        expect(parser.createError).toHaveBeenCalledTimes(1);

    });
    
    it("should parsing goes as expected", () => {
        parser.parse = jest.fn(()=>{
            const validationErrors = [];
        if (validationErrors.length > 0) {
            console.error(validationErrors);
            throw Error('Validation failed!');
        }
        });

        expect(parser.parse).not.toThrow('Validation failed!');
    });

    it("should stop parsing with throwing error", () => {
        parser.parse = jest.fn(()=>{
            const validationErrors = [{},{}];
        if (validationErrors.length > 0) {
            throw Error('Validation failed!');
        }
        });

        expect(parser.parse).toThrow('Validation failed!');
    });

    it("should error when line column length less then schema column length", () => {
        let content = "Product name,Price,Quantity\n9.00,2";
        parser.createError = jest.fn();

        parser.validate(content);

        expect(parser.createError).toHaveBeenCalledTimes(1);
        expect(parser.createError).toHaveBeenCalledWith('row', 1, -1,"Expected row to have 3 cells but received 2.");

    });

    it("should continue validate when line column length equal schema column length", () => {
        let content = "Product name,Price,Quantity\nFirst item,9.00,2";
        parser.createError = jest.fn();

        parser.validate(content);

        expect(parser.createError).toHaveBeenCalledTimes(0);
    });

    it("should create validate error with empty in first column data line", ()=>{
        let content = "Product name,Price,Quantity\n,9.00,2";
        parser.createError = jest.fn();

        parser.validate(content);

        expect(parser.createError).toHaveBeenCalledTimes(1);
        expect(parser.createError).toHaveBeenCalledWith('cell', 1, 0,"Expected cell to be a nonempty string but received \"\".");
    });

    it("should create validate error with negative number in second column data line", ()=>{
        let content = "Product name,Price,Quantity\nMollis consequat,-1,2";
        parser.createError = jest.fn();

        parser.validate(content);

        expect(parser.createError).toHaveBeenCalledTimes(1);
        expect(parser.createError).toHaveBeenCalledWith('cell', 1, 1,"Expected cell to be a positive number but received \"-1\".");
    });

    it("should parse number from csv line", ()=>{
        let content = "Mollis consequat,9.00,2";

        expect(parser.parseLine(content)).toHaveProperty('price', 9);
        expect(parser.parseLine(content)).toHaveProperty('quantity', 2);
    });

    it("should add correct id", ()=>{
        let content = "Mollis consequat,9.00,2";

        expect(parser.parseLine(content).id.length).toBe("3e6def17-5e87-4f27-b6b8-ae78948523a9".length);
    });

});

describe("CartParser - integration tests", () => {
    it("should parse sample csv file and call defined functions", () => {
        let path = "samples/cart.csv";

        parser.readFile = jest.fn(()=>{
            return readFileSync(path, 'utf-8', 'r');
        });
        parser.validate = jest.fn(()=>{
            return 0;
        });
        parser.parseLine = jest.fn();
        parser.calcTotal = jest.fn(()=>{
            return 348.32;
        });

        let result = parser.parse(path);

        expect(parser.readFile).toHaveBeenCalledTimes(1);
        expect(parser.validate).toHaveBeenCalledTimes(1);            
        expect(parser.parseLine).toHaveBeenCalledTimes(5);
        expect(parser.calcTotal).toHaveBeenCalledTimes(1);
        expect(result).toBeTruthy();
        expect(result.items.length).toBe(5);
    });
});