    GET :

+ /api/v1/decoder/{id}/vin - VIN decoder - **не** используется
+ /api/v1/decoder/{id}/vindecode - VIN decoder from text - **используется в декодировании VIN внутри форм inventory (general), deal (trade1/2)**
+ /api/v1/decoder/{taskuid}/barcode - decode barcode from dl back image ( get results) - **не** используется
+ /api/v1/decoder/{taskuid}/vin - decode barcode from dl back image ( get results) - **не** используется
+ /api/v1/decoder/{id}/task - get task info - **не** используется
+ /api/v1/decoder/tasks - list completed tasks - **не** используется
+ /api/v1/decoder/queue - list active tasks - **не** используется
  POST :
+ /api/v1/decoder/{id}/vin - VIN decoder ( with details provided in json payload or as id, create task) - **не** используется
+ /api/v1/decoder/vinbarcode - decode barcode from VIN image ( create task) - **не** используется
+ /api/v1/decoder/barcode - decode barcode from dl back image ( create task) - **не** используется
+ /api/v1/decoder/dlbarcode - decode barcode from dl back image ( immediate return) - **используется в contact (general information) при сканировании driver licence**
+ /api/v1/decoder/vin - decode VIN from image ( create task) - **не** используется
+ /api/v1/decoder/{id}/vindecode - decode VIN from string ( payload) - **не** используется
+ /api/v1/decoder/vindecode - decode VIN from string ( payload) - **не** используется
+ /api/v1/decoder/{taskuid}/delete - delete task - **не** используется
+ /api/v1/decoder/vinimage - decode VIN from image ( immediate decoder) - **не** используется
