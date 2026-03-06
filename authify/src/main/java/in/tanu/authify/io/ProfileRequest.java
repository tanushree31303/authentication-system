package in.tanu.authify.io;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileRequest {

    @NotBlank(message ="Name should not be empty ")
    private String name;

    @Email(message = "Enter valid email")
    @NotNull(message ="email should not be empty ")
    private String email;

    @Size(min = 6,message = "Password must be minimum 6 characters ")
    private String password;

}
