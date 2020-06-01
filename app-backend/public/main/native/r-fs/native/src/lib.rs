use std::fs;
use neon::prelude::*;

//Async me?

fn get_file(mut cx: FunctionContext) -> JsResult<JsString> {
	let file_loc = cx.argument::<JsString>(0)?.value();
	let file_contents = match fs::read_to_string(file_loc) {
		Ok(val) => cx.string(val),
    	Err(_) => cx.string(""),
	};
    Ok(file_contents)
}

register_module!(mut cx, {
    cx.export_function("getFile", get_file)
});
