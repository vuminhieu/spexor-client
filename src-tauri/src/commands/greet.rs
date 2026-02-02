use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct GreetResponse {
    pub message: String,
    pub timestamp: String,
}

#[tauri::command]
pub fn greet(name: String) -> GreetResponse {
    GreetResponse {
        message: format!("Hello, {}! Welcome to Spexor.", name),
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}

#[tauri::command]
pub async fn greet_async(name: String) -> Result<GreetResponse, String> {
    // Simulate async operation
    tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;

    Ok(GreetResponse {
        message: format!("Async hello, {}!", name),
        timestamp: chrono::Utc::now().to_rfc3339(),
    })
}
