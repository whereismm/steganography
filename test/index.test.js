const Bmp = require('../src/bmp/index')

describe('Bmp class tests utils functions', () => {
    const bmp = new Bmp();
    test('sample test : get round image size', () => {
        expect(bmp.getRound_size(20)).toBe(5);
        expect(bmp.getRound_size(2215)).toBe(48);
        expect(bmp.getRound_size(1425)).toBe(38);
        expect(bmp.getRound_size(3240)).toBe(57);
    })

    test('sample test: get real image size', () =>{
        expect(bmp.getRealSize(5)).toBe(2);
        expect(bmp.getRealSize(30)).toBe(4);
        expect(bmp.getRealSize(57)).toBe(5);
        expect(bmp.getRealSize(48)).toBe(4);
    })
});

