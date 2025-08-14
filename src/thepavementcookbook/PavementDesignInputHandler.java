package thepavementcookbook;

import java.util.Scanner;

public class PavementDesignInputHandler {
	private Scanner scanner;

    public PavementDesignInputHandler() {
    this.scanner = new Scanner(System.in);
	    }

    public PavementDesignInput collectInput() {
    	PavementDesignInput input = new PavementDesignInput();

	    // Standard Selection
    	System.out.println("Select Standard (0: DMRB, 1: test): ");
    	int standardChoice = scanner.nextInt();
    	input.setStandard(standardChoice == 0 ? "DMRB" : "test"); // Assuming only these two options

    	// MSA Input
    	System.out.println("Enter MSA (Mean Structural Axle): ");
    	input.setMsa(scanner.nextInt());

	    return input; // Return the collected input
	    }

	    public void closeScanner() {
	        scanner.close();
	    }
	}

}
