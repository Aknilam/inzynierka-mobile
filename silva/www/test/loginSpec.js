describe("mmLogin module", function() {
  beforeEach(module('mmLogin'));

  describe("mmLogin factory", function() {
    beforeEach(module('mmLogin'));
    var mmLogin;

    beforeEach(inject(function(_mmLogin_) {
      mmLogin = _mmLogin_;
    }));

    it("initial state", function() {
      expect(mmLogin.state).toEqual(mmLogin.states.unauthorized);
    });
  });
});
