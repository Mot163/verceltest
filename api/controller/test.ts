import { Controller, RequestMapping, GetMapping } from '../../dispatcher/Annotation';

@Controller()
@RequestMapping('/test')
class Test {
    @GetMapping('/hello')
    public hello() {
        return 'hello hello hello';
    }
}

export default Test;
