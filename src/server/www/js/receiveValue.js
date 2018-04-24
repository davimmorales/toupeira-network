(() => {

  const initialize = () => {
    $('#receiveValueButton').click(submitReceiveValue);
  }

  const submitReceiveValue = (evt) => {
    // prevent form submission
    evt.preventDefault();
    evt.stopPropagation();
    // get form data
    const receiveValueInput = document.getElementById('receiveValueInput');
    // make the AJAX call
    $.ajax({
      url: '/api/receive',
      type: 'POST',
      data: {
          receiveValue: receiveValueInput.value
      },
      success: () => { console.log('Submit receive-value successful'); },
      error: () => { console.log('Submit receive-value failed'); }
    });
  }

  // initialize on document ready
  $(document).ready(initialize);

})();