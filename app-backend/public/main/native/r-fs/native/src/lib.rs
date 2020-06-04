use std::fs;
use std::io::prelude::*;
use neon::prelude::*;
use serde_json::{Value, json, to_writer};
use chrono::{Utc};
use tempfile::{Builder};

//Async me?

fn get_unix_timestamp_ms() -> i64 {
    let now = Utc::now();
    now.timestamp_millis()
}

fn get_file(mut cx: FunctionContext) -> JsResult<JsString> {
	let file_loc = cx.argument::<JsString>(0)?.value();
	let file_contents = match fs::read_to_string(file_loc) {
		Ok(val) => cx.string(val),
		Err(_) => cx.string(""),
	};
    Ok(file_contents)
}

fn atomic_write(file_loc: String, file_cont: String) -> Result<bool, &'static str> {
	//Create temporary file!
	let tmp: tempfile::NamedTempFile;
	match Builder::new().tempfile() {
		Ok(temp) => {tmp = temp},
		Err(_) => return Err("Failed to create temporary file."),
	}
	// Read incoming JSON, append lastModified field, write to tempfile!
	let mut new_file_cont: Value = match serde_json::from_str(&file_cont) {
    	Ok(pjson) => pjson,
		Err(_) => return Err("Could not parse incoming file as JSON."),
    };
    let now = get_unix_timestamp_ms();
    if let Value::Object(ref mut map) = new_file_cont {
	    map.insert("lastModified".to_string(), json!(&now));
	}
	match to_writer(&tmp, &new_file_cont) {
		Ok(_) => {},
		Err(_) => return Err("Failed to write to temporary file."),
	}
	// Open, read, and parse existing file!

	// Could also implement file locking here, maybe. I don't want to unless we need it, though,
	// as it would be a bit messy what with the file replacement and such.
	match fs::File::open(&file_loc) {
		Ok(mut file) => {
			let mut contents = String::new();
		    match file.read_to_string(&mut contents) {
		    	Ok(_) => {},
				Err(_) => return Err("Could not read existing file."),
		    };
		    let v: Value = match serde_json::from_str(&contents) {
		    	Ok(pjson) => pjson,
				Err(_) => return Err("Could not parse existing file as JSON."),
		    };

		    let file_last_modified = match v.get("lastModified") {
		    	Some(flm) => {match flm.as_i64() {
		    		Some(flmi) => flmi,
		    		None => return Err("Could not parse existing file's lastModified field.")
		    	}},
		    	//Assume file is older if lastModified is missing.
				None => 0,
		    };
		    if file_last_modified >= now {
		    	//File on disk is newer! Abort!
		    	return match tmp.close() {
		    		Ok(_) => Ok(false),
					Err(_) => Err("Failed to remove temporary file."),
		    	}
		    } 
		},
		Err(_) => {
			//No file on disk! Creating a new one!
			return match tmp.persist(file_loc) {
				Ok(_) => Ok(true),
				Err(_) => Err("Failed to persist temporary file."),
			}
		}, 
	};
	//Overwriting existing file!
	return match tmp.persist(file_loc) {
		Ok(_) => Ok(true),
		Err(_) => Err("Failed to overwrite existing file."),
	}
}

fn write_file(mut cx: FunctionContext) -> JsResult<JsString> {
	let file_loc = cx.argument::<JsString>(0)?.value();
	let file_cont = cx.argument::<JsString>(1)?.value();
	return match atomic_write(file_loc, file_cont) {
		Ok(_) => Ok(cx.string("")),
		Err(err) => Ok(cx.string(err))
	}
}

/*fn write_file(mut cx: FunctionContext) -> JsResult<JsBoolean> {
	let file_loc = cx.argument::<JsString>(0)?.value();
	let file_con = cx.argument::<JsString>(1)?.value();
	let result = match fs::write(file_loc, file_con) {
		Ok(_) => cx.boolean(true),
		Err(_) => cx.boolean(false),
	};
	Ok(result)
}*/

register_module!(mut cx, {
    cx.export_function("getFile", get_file)?;
    cx.export_function("writeFile", write_file)?;
    Ok(())
});

#[cfg(test)]
mod tests {
    // Note this useful idiom: importing names from outer (for mod tests) scope.
    use super::*;
    #[test]
    fn write_file_test() {

        let file_loc = "./testout.txt".to_string();
		let file_cont = json!(
			{"lastModified":1691211527341i64, "ops":[{"type":"paragraph","children":[{"text":"Gandaaaaaaaaaaaaaaaaaalf","bold":true},{"text":" the "},{"text":"Grey","color":"#aaa"}]}]}
		).to_string();

		assert_eq!(atomic_write(file_loc, file_cont), Ok(true));
    }
}
