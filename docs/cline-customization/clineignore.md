```text
### .clineignore support

To help you better control which files can be accessed by Cline, we have implemented a `.clineignore` feature similar to `.gitignore`. This allows you to specify which files and directories Cline **cannot** access or process. This feature is useful in the following aspects:

* **Privacy:** Prevent Cline from accessing sensitive or private files in your workspace.
* **Performance:** Exclude large directories or files unrelated to your task, which may improve Cline's efficiency.
* **Context management:** Keep Cline's focus on the relevant parts of your project.

**How to use `.clineignore`**

1. **Create a `.clineignore` file:** In the root directory of your workspace (same level as the `.vscode` folder, or the top-level folder you opened in VS Code), create a new file named `.clineignore`.

2. **Define ignore patterns:** Open the `.clineignore` file and specify the patterns of files and directories you want Cline to ignore. The syntax is the same as `.gitignore`:

    * Each line represents a pattern.
    * **Support standard glob patterns:**
        * `*` matches zero or more characters
        * `?` matches one character
        * `[]` matches a range of characters
        * `**` matches any number of directories and subdirectories

    * **Directory pattern:** Add `/` at the end of the pattern to specify a directory.
    * **Inverse pattern:** Add `!` before the pattern to reverse (unignore) a pattern that was previously ignored.
    * **Comments:** Lines starting with `#` are comments.

    **Example `.clineignore` file:**

    ```text
    # Ignore log files
    *.log

    # Ignore the entire 'node_modules' directory
    node_modules/

    # Ignore all files in the 'temp' directory and its subdirectories
    temp/**

    # Do not ignore 'important.log' in the root directory
    !important.log

    # Ignore any file named 'secret.txt' in subdirectories
    **/secret.txt
    ```

3. **Cline will follow your `.clineignore` rules:** Once you save the `.clineignore` file, Cline will automatically recognize and apply these rules.

    * **File access control:** Cline will be unable to read the content of ignored files using tools like `read_file`. If you attempt to use a tool on an ignored file, Cline will notify you that access is blocked due to `.clineignore` settings.
    * **File listing:** When you ask Cline to list files in a directory (e.g., using `list_files`), ignored files and directories will still be listed, but their names will be accompanied by a **🔒** symbol, indicating they are ignored. This helps you understand which files Cline can and cannot interact with.

4. **Dynamic updates:** Cline monitors changes to your `.clineignore` file. If you modify, create, or delete the `.clineignore` file, Cline will automatically update its ignore rules without needing to restart VS Code or the extension.

**Summary**

The `.clineignore` file provides a powerful and flexible way to control Cline's access to files in your workspace, enhancing privacy, performance, and context management. By leveraging the familiar `.gitignore` syntax, you can easily adjust Cline's focus to the most relevant parts of your project.