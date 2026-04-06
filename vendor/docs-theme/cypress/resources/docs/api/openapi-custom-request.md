# Lorem

## Open API

<script>
  function customizeRequest(request) {
    console.log("Customizing request.");
    return request;
  }
</script>

<div
  class="material-openapi"
  data-try-it-out-btn="true"
  data-authorize-btn="true"
  data-custom-request-function="customizeRequest"
  data-openapi-url="{{ '../' if config['use_directory_urls'] }}openapi.yaml"
></div>
