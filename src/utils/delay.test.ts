import { delay } from './delay';

describe('Delayed functions', () => {
    it('should be called', done => {
        const mock = jest.fn((a) => a);

        delay(200).then(mock);

        setTimeout(() => {
            expect(mock).toHaveBeenCalled();
            done();
        }, 300);
    });
});
