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

fn write_file(mut cx: FunctionContext) -> JsResult<JsBoolean> {
	let file_loc = cx.argument::<JsString>(0)?.value();
	let file_con = cx.argument::<JsString>(1)?.value();
	let result = match fs::write(file_loc, file_con) {
		Ok(_) => cx.boolean(true),
		Err(_) => cx.boolean(false),
	};
	Ok(result)
}

register_module!(mut cx, {
    cx.export_function("getFile", get_file)?;
    cx.export_function("writeFile", write_file)?;
    Ok(())
});
