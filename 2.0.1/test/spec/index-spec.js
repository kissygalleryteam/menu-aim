KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('menu-aim', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','kg/menu-aim/2.0.1/']});