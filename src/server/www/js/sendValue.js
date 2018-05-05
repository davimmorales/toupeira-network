(() => {

  const initialize = () => {
    $('#sendValueButton').click(updateSendValue);
  }
  
  const updateSendValue = (evt) => {
    // prevent form submission
    evt.preventDefault();
    evt.stopPropagation();
    // make the AJAX call
    $.ajax({
      url: '/api/send',
      type: 'GET',
      dataType: 'json',
      success: (jsonData) => {
        // update form data
        document.getElementById('sendValueInput').value = jsonData.value;
        console.log('Reload send-value successful');
      },
      error: () => { console.log('Reload send-value failed'); }
    });
  }

  // initialize on document ready
  $(document).ready(initialize);
  
})();