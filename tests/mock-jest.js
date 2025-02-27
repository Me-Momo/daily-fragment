// Dev node: Come on!!! this is super ugly...
// If you find a stable way to debug the jest tests please fork me!
// As documented here: https://facebook.github.io/jest/docs/troubleshooting.html is not working as far of May/17
if (typeof global === 'undefined' && typeof window !== 'undefined') global = window;

let HIDE_SUCCESS_VALIDATION = true;

global._mockJest = null;

global.clearTest = () => {
  global._mockJest = {
    errors: 0,
    passed: 0,
    descriptions: []
  };
};
global.clearTest();

global.describe = (description, cbDefineIts) => {
  global._mockJest.descriptions.push({
    description,
    its: []
  });

  cbDefineIts();
  startTests();
};

global.describe.skip = () => undefined;

global.it = (description, cbTest) => {
  global._mockJest.descriptions[global._mockJest.descriptions.length - 1].its.push({
    description,
    cbTest
  });
  startTests();
};

global.it.skip = () => undefined;

global.expect = (expectValue) => {
  return comparisons(expectValue);
};

let comparisons = (expectValue, not = false) => {
  return {
    get not() {
      return comparisons(expectValue, true)
    },
    toBe: (toBeValue) => {
      let result = expectValue === toBeValue;
      if (not) result = !result;
      if (result) {
        if (!HIDE_SUCCESS_VALIDATION) console.log('        Success, === equal value');
        global._mockJest.passed++;
      }
      else {
        console.log(`        FAILED, expected [${toBeValue}] but received [${expectValue}]`);
        global._mockJest.errors++;
      }
    }
  }
};

let startTimer = null;
function startTests() {
  if (startTimer) clearTimeout(startTimer);
  startTimer = setTimeout(executeTests, 100);
}

function executeTests() {
  console.log('### TESTs begin');
  let descriptions = [].concat(global._mockJest.descriptions);

  const processTheNextDescription = ()=>{
    let description = descriptions.shift();
    if (description) {
      executeADescription(description, () => {
        processTheNextDescription();
      });
    }
    else{
      finished();
    }
  };

  // start
  processTheNextDescription();
}

function executeADescription(description, cbCompleted) {
  console.log('Description::: Start:', description.description);
  let its = [].concat(description.its);

  executeIts(its, () => {
    console.log('Description::: Finished:', description.description);
    cbCompleted();
  });
}

function executeIts(its, cbCompleted) {
  let it = its.shift();
  if (!it){
    cbCompleted();
    return;
  }

  console.log('    it:::', it.description);
  if (it.cbTest.length === 0) {
    it.cbTest();
    executeIts(its, cbCompleted);
  }
  else{
    it.cbTest(()=>{
      executeIts(its, cbCompleted);
    });
  }
}

function finished() {
  let report = '### All TEST finished, results:' + ' ' + 'errors:' + ' ' + global._mockJest.errors + ' ' + 'passed:' + ' ' + global._mockJest.passed;
  console.log('');
  if (global._mockJest.errors) {
    console.log('xx     xx');
    console.log(' xx   xx ');
    console.log('  xx xx  ');
    console.log('   xxx   ');
    console.log('  xx xx  ');
    console.log(' xx   xx ');
    console.log('xx     xx ' + report);
  }
  else {
    console.log('        vv');
    console.log('       vv');
    console.log('      vv');
    console.log('     vv');
    console.log('vv  vv');
    console.log(' vvvv');
    console.log('  vv      ' + report);
  }
}
