let db = require("./config23")

db.insert("test","test", {"sex": "女"})
db.update("test","test", {"sex": "女"}, {"sex": "男"})
db.count("test","test");