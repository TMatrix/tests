import CartParser from './CartParser';

let parser, validate;

beforeEach(() => {
    parser = new CartParser();
});

describe("CartParser - unit tests", () => {
    // Add your unit tests here.
    it("should columns header to be correct named", () => {
        let headerArr = parser.schema.columns;
        let argsToValidate = "";
        headerArr.forEach((elem, index) => {
            if(index < headerArr.length - 1){
                argsToValidate +=elem.name + ", ";
            }else{
                argsToValidate +=elem.name;
            }
        });
        parser.createError = jest.fn();

        parser.validate(argsToValidate);

        expect(parser.createError).toHaveBeenCalledTimes(0);

    });

    it("should not validate incorrect header names", () => {
        let headerArr = parser.schema.columns;
        let argsToValidate = "";
        headerArr.forEach((elem, index) => {
            if(index < headerArr.length - 1){
                argsToValidate += `header${index}` + ", ";
            }else{
                argsToValidate +=`header${index}`;
            }
        });
        parser.createError = jest.fn();

        parser.validate(argsToValidate);

        expect(parser.createError).toHaveBeenCalledTimes(headerArr.length);

    });
    
    // it("cell should be a nonempty string", () => {

    //     parser.createError = jest.fn();

    //     parser.validate(contents);

    //     expect(parser.createError).toHaveBeenCalledTimes(1);
    //     expect(parser.createError).toHaveBeenCalledWith(1);

    // });

});

describe("CartParser - integration tests", () => {
    // Add your integration tests here.
    
    //Get cvs file and return object
});