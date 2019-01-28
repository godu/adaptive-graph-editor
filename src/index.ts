export const foo: () => 'foo' = () => 'foo';
export const bar: () => 'bar' = () => 'bar';

// tslint:disable-next-line:no-inner-html
window.document.body.innerHTML = foo();

if (module.hot) {
  module.hot.accept();
}
