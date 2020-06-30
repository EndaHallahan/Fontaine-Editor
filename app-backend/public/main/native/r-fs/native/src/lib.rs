use std::fs;
use std::io::prelude::*;
use neon::prelude::*;
use serde_json::{Value, json, to_writer};
use chrono::{Utc};
use tempfile::{Builder};
use base64::{encode};

/*
The following macro was taken from 
https://github.com/mattrglobal/node-bbs-signatures/blob/master/native/src/macros.rs
and is licensed under its original Apache 2.0 license as follows. The name of the 
macro has been changed from 'slice_to_js_array_buffer' to 'slice_to_array_buffer'.
*/
/* Should probably replace this with a function someday. */
///////////////////////////////////////////////////////////////////////////////////
/*
 * Copyright 2020 - MATTR Limited
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

macro_rules! slice_to_array_buffer {
    ($slice:expr, $cx:expr) => {{
        let mut result = JsArrayBuffer::new(&mut $cx, $slice.len() as u32)?;
        $cx.borrow_mut(&mut result, |d| {
            let bytes = d.as_mut_slice::<u8>();
            bytes.copy_from_slice($slice);
        });
        result
    }};
}

///////////////////////////////////////////////////////////////////////////////////

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
//This method is currently unused, but I'm keeping it in for now. Just in case.
fn get_as_base64(mut cx: FunctionContext) -> JsResult<JsString> {
	let file_loc = cx.argument::<JsString>(0)?.value();
	let encoded_file_cont = match fs::read(&file_loc) {
		Ok(file_cont) => cx.string(encode(file_cont)),
		Err(_err) => cx.string("")
	};
	Ok(encoded_file_cont)
}

fn get_as_bin(mut cx: FunctionContext) -> JsResult<JsArrayBuffer> {
	let file_loc = cx.argument::<JsString>(0)?.value();
	let encoded_file_cont = match fs::read(&file_loc) {
		Ok(file_cont) => slice_to_array_buffer!(file_cont.as_slice(), cx),
		Err(_err) => cx.array_buffer(0)?
	};
	Ok(encoded_file_cont)
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
	// as it could get a bit messy what with the file replacement and such.
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
//Writes files atomically. JSON ONLY.
fn write_file(mut cx: FunctionContext) -> JsResult<JsString> {
	let file_loc = cx.argument::<JsString>(0)?.value();
	let file_cont = cx.argument::<JsString>(1)?.value();
	return match atomic_write(file_loc, file_cont) {
		Ok(_) => Ok(cx.string("")),
		Err(err) => Ok(cx.string(err))
	}
}
// Directly (un-atomically) writes a file.
fn write_file_direct(mut cx: FunctionContext) -> JsResult<JsString> {
	let file_loc = cx.argument::<JsString>(0)?.value();
	let file_cont = cx.argument::<JsString>(1)?.value();
	match fs::File::create(file_loc) {
		Ok(mut file) => match file.write_all(&file_cont.as_bytes()) {
			Ok(_) => return Ok(cx.string("")),
			Err(_err) => return Ok(cx.string("Failed to write file."))
		},
		Err(_err) => Ok(cx.string("Failed to create file."))
	}
}

fn copy_file(mut cx: FunctionContext) -> JsResult<JsString> {
	let file_from = cx.argument::<JsString>(0)?.value();
	let file_to = cx.argument::<JsString>(1)?.value();
	return match fs::copy(&file_from, &file_to) {
		Ok(_) => Ok(cx.string("")),
		Err(_err) => Ok(cx.string(format!("Failed to copy file '{}' to '{}'", file_from, file_to)))
	}
}

fn file_lister(dir: String) -> Vec<String> {
	let entries: Vec<_> = fs::read_dir(dir).unwrap().map(
		|res| res.unwrap().path().file_name().unwrap().to_str().unwrap().to_string() //1!!!!!!!!!!!!!!!!!!!!!!!!!!
	).collect();
    return entries;
}

fn list_files(mut cx: FunctionContext) -> JsResult<JsArray> {
	let dir = cx.argument::<JsString>(0)?.value();

	let entries = file_lister(dir);
	
	let js_array = JsArray::new(&mut cx, entries.len() as u32);
	for (i, obj) in entries.iter().enumerate() {
        let js_string = cx.string(obj);
        js_array.set(&mut cx, i as u32, js_string).unwrap(); //1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }

    Ok(js_array)
}

register_module!(mut cx, {
    cx.export_function("getFile", get_file)?;
    cx.export_function("getAsBase64", get_as_base64)?;
    cx.export_function("getAsBin", get_as_bin)?;
    cx.export_function("writeFile", write_file)?;
    cx.export_function("writeFileDirect", write_file_direct)?;
    cx.export_function("copyFile", copy_file)?;
    cx.export_function("listFiles", list_files)?;
    Ok(())
});

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn write_file_test() {

        let file_loc = "./testout.txt".to_string();
		let file_cont = json!(
			{"lastModified":1691211527341i64, "ops":[{"type":"paragraph","children":[{"text":"Gandalf","bold":true},{"text":" the "},{"text":"Grey","color":"#aaa"}]}]}
		).to_string();

		assert_eq!(atomic_write(file_loc, file_cont), Ok(true));
    }

    #[test]
    fn list_files_test() {

        let file_loc = "./".to_string();

        let out_vec = file_lister(file_loc);

        println!("{:?}", out_vec);

        panic!();

    }
}
